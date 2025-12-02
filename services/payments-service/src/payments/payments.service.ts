import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { Payment, PaymentDocument, PaymentStatus } from './schemas/payment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @Inject('RABBITMQ_SERVICE') private rabbitClient: ClientProxy,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<PaymentDocument> {
    const payment = new this.paymentModel({
      ...createPaymentDto,
      status: PaymentStatus.PENDING,
      transactionId: this.generateTransactionId(),
    });

    const savedPayment = await payment.save();

    // Emit event to RabbitMQ
    this.rabbitClient.emit('payment.created', {
      paymentId: savedPayment._id.toString(),
      userId: savedPayment.userId,
      amount: savedPayment.amount,
      currency: savedPayment.currency,
      status: savedPayment.status,
      timestamp: new Date(),
    });

    return savedPayment;
  }

  async findAll(): Promise<PaymentDocument[]> {
    return this.paymentModel.find().exec();
  }

  async findByUserId(userId: string): Promise<PaymentDocument[]> {
    return this.paymentModel.find({ userId }).exec();
  }

  async findOne(id: string): Promise<PaymentDocument> {
    const payment = await this.paymentModel.findById(id).exec();
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<PaymentDocument> {
    const payment = await this.paymentModel
      .findByIdAndUpdate(id, updatePaymentDto, { new: true })
      .exec();

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    // Emit event if status changed
    if (updatePaymentDto.status) {
      this.rabbitClient.emit('payment.status.updated', {
        paymentId: payment._id.toString(),
        userId: payment.userId,
        status: payment.status,
        timestamp: new Date(),
      });
    }

    return payment;
  }

  async processPayment(id: string): Promise<PaymentDocument> {
    // Simulate payment processing
    const payment = await this.findOne(id);

    // Simulate random success/failure (80% success rate)
    const isSuccess = Math.random() > 0.2;

    const newStatus = isSuccess ? PaymentStatus.COMPLETED : PaymentStatus.FAILED;

    const updatedPayment = await this.update(id, { status: newStatus });

    // Emit completion event
    this.rabbitClient.emit('payment.processed', {
      paymentId: updatedPayment._id.toString(),
      userId: updatedPayment.userId,
      amount: updatedPayment.amount,
      status: updatedPayment.status,
      success: isSuccess,
      timestamp: new Date(),
    });

    return updatedPayment;
  }

  async remove(id: string): Promise<void> {
    const result = await this.paymentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
  }

  private generateTransactionId(): string {
    return `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }
}