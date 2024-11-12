import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameloopComponent } from './gameloop.component';

describe('GameloopComponent', () => {
  let component: GameloopComponent;
  let fixture: ComponentFixture<GameloopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameloopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameloopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
