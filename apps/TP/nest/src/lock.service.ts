import { Injectable } from '@nestjs/common';
import Redlock from 'redlock';
import Redis from "ioredis";

const redisClient = new Redis({
  host: process.env.HOST,
  port: parseInt(process.env.PORT),       
});

@Injectable()
export class LockService {
  private redlock: Redlock;

  constructor() {    

     this.redlock = new Redlock([redisClient], {
      retryCount:  parseInt(process.env.RETRYCOUNT),
      retryDelay:  parseInt(process.env.RETRYDELAY), // time in ms
      retryJitter:  parseInt(process.env.RETRYJITTER), // time in ms
    });

    this.redlock.on('clientError', (err) => {
      console.error('A Redis error has occurred:', err);
    });
  }
  async acquireLock(resource: string[], ttl: number) {
    return await this.redlock.acquire(resource, ttl);
  }
  async releaseLock(lock) {
    return await lock.release();
  } 

}
