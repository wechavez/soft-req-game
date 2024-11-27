import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appParseHtml',
  standalone: true,
})
export class ParseHtmlPipe implements PipeTransform {
  transform(value: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(value, 'text/html');
    return doc.documentElement.textContent || '';
  }
}
