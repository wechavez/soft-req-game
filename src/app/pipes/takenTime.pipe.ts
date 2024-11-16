import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appTakenTime',
  standalone: true,
})
export class TakenTimePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    const [hours, minutes, seconds] = value.split(':').map(Number);
    const parts: string[] = [];

    if (hours > 0) {
      parts.push(`${hours}h`);
    }
    if (minutes > 0) {
      parts.push(`${minutes}min`);
    }
    if (seconds > 0) {
      parts.push(`${seconds}s`);
    }

    return parts.join(' ') || '0s';
  }
}
