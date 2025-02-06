import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IceCreamModule } from './ice-cream/ice-cream.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    IceCreamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
