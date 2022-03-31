import { Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

export interface Hero {
  id: number;
  name: string;
}

export interface HeroById {
  id: number;
}

export interface HeroService {
  findOne(data: HeroById, metadata: Metadata): Observable<Hero>;
}
