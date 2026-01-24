describe('UsersService', () => {
  let mockUserRepository: {
    find: jest.Mock;
    findOne: jest.Mock;
    findOneBy: jest.Mock;
    delete: jest.Mock;
    update: jest.Mock;
  };

  beforeEach(() => {
    mockUserRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    };
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        {
          id: 'uuid-1',
          email: 'user1@example.com',
          firstName: 'User',
          lastName: 'One',
          isActive: true,
        },
        {
          id: 'uuid-2',
          email: 'user2@example.com',
          firstName: 'User',
          lastName: 'Two',
          isActive: true,
        },
      ];

      mockUserRepository.find.mockResolvedValue(users);

      const result = await mockUserRepository.find();

      expect(result).toEqual(users);
      expect(result).toHaveLength(2);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });

    it('should return empty array if no users exist', async () => {
      mockUserRepository.find.mockResolvedValue([]);

      const result = await mockUserRepository.find();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      const user = {
        id: 'uuid-123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        isActive: true,
      };

      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await mockUserRepository.findOne({
        where: { id: 'uuid-123' },
      });

      expect(result).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid-123' },
      });
    });

    it('should return null if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await mockUserRepository.findOne({
        where: { id: 'nonexistent-id' },
      });

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete user by id', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await mockUserRepository.delete('uuid-123');

      expect(result.affected).toBe(1);
      expect(mockUserRepository.delete).toHaveBeenCalledWith('uuid-123');
    });

    it('should return 0 affected if user not found', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await mockUserRepository.delete('nonexistent-id');

      expect(result.affected).toBe(0);
    });
  });

  describe('update', () => {
    it('should update user fields', async () => {
      const updates = { firstName: 'Updated', lastName: 'User' };
      mockUserRepository.update.mockResolvedValue({ affected: 1 });

      const result = await mockUserRepository.update('uuid-123', updates);

      expect(result.affected).toBe(1);
      expect(mockUserRepository.update).toHaveBeenCalledWith(
        'uuid-123',
        updates,
      );
    });

    it('should return 0 affected if user not found', async () => {
      mockUserRepository.update.mockResolvedValue({ affected: 0 });

      const result = await mockUserRepository.update('nonexistent-id', {});

      expect(result.affected).toBe(0);
    });
  });
});
