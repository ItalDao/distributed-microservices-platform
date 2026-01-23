import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let mockUserRepository: any;

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('test-token'),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'Test123456!',
        firstName: 'Test',
        lastName: 'User',
      };

      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const newUser = {
        id: 'uuid-123',
        email: registerDto.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        password: hashedPassword,
        isActive: true,
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(newUser);
      mockUserRepository.save.mockResolvedValue(newUser);
      jwtService.sign.mockReturnValue('access-token');

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe(registerDto.email);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
    });

    it('should throw error if user already exists', async () => {
      const registerDto = {
        email: 'existing@example.com',
        password: 'Test123456!',
        firstName: 'Test',
        lastName: 'User',
      };

      mockUserRepository.findOne.mockResolvedValue({
        id: 'uuid-123',
        email: registerDto.email,
      });

      await expect(service.register(registerDto)).rejects.toThrow(
        'User already exists',
      );
    });

    it('should throw error for invalid email', async () => {
      const registerDto = {
        email: 'invalid-email',
        password: 'Test123456!',
        firstName: 'Test',
        lastName: 'User',
      };

      await expect(service.register(registerDto)).rejects.toThrow(
        'Invalid email format',
      );
    });

    it('should throw error for weak password', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'weak',
        firstName: 'Test',
        lastName: 'User',
      };

      await expect(service.register(registerDto)).rejects.toThrow(
        'Password must be at least 8 characters',
      );
    });
  });

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      const email = 'test@example.com';
      const password = 'Test123456!';
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = {
        id: 'uuid-123',
        email,
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        isActive: true,
      };

      mockUserRepository.findOne.mockResolvedValue(user);
      jwtService.sign.mockReturnValue('access-token');

      const result = await service.login({ email, password });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe(email);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('should throw error with incorrect password', async () => {
      const email = 'test@example.com';
      const hashedPassword = await bcrypt.hash('Test123456!', 10);

      const user = {
        id: 'uuid-123',
        email,
        password: hashedPassword,
      };

      mockUserRepository.findOne.mockResolvedValue(user);

      await expect(
        service.login({ email, password: 'WrongPassword123!' }),
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nonexistent@example.com', password: 'Test123456!' }),
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('validateUser', () => {
    it('should return user if validation succeeds', async () => {
      const user = {
        id: 'uuid-123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };

      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.validateUser('test@example.com');

      expect(result).toEqual(user);
    });

    it('should throw error if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.validateUser('nonexistent@example.com'),
      ).rejects.toThrow();
    });
  });
});
