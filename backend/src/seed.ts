import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const adminEmail = 'admin@myfarmops.app';
  const existingUser = await usersService.findOneByEmail(adminEmail);

  if (!existingUser) {
    try {
      await usersService.create({
        email: adminEmail,
        password: 'password', // Will be hashed by UsersService
        fullName: 'System Admin',
        cin: 'ADMIN001',
        phone: '0600000000',
        role: 'admin',
      });
      console.log('✅ Admin user created successfully');
      console.log('Email: admin@myfarmops.app');
      console.log('Password: password');
    } catch (error) {
      console.error('❌ Error creating admin user:', error);
    }
  } else {
    console.log('ℹ️ Admin user already exists');
  }

  await app.close();
}

bootstrap();
