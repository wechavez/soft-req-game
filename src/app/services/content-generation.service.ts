import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { RequirementsContentResponse, Requirement } from '@types';
import { delay, map, Observable, of } from 'rxjs';

const fakeContent = {
  requirements: [
    {
      no: 1,
      text: 'La aplicación debe cargar rápidamente las páginas de productos.',
      isValid: false,
      feedback:
        "El término 'rápidamente' es vago y subjetivo. Se debe especificar un tiempo de carga particular para que el requisito sea medible.",
    },
    {
      no: 2,
      text: 'El sistema debe enviar notificaciones a los usuarios cuando se registren en la plataforma.',
      isValid: true,
      feedback:
        'Está bien definido porque establece una acción concreta que el sistema debe realizar.',
    },
    {
      no: 3,
      text: 'Los usuarios deben poder recuperar su contraseña.',
      isValid: false,
      feedback:
        'El requerimiento carece de detalles sobre cómo debe realizarse la recuperación, qué métodos válidos existen y si se requiere validación.',
    },
    {
      no: 4,
      text: 'El sistema tendrá una opción para que los usuarios comenten en los productos.',
      isValid: false,
      feedback:
        'Es un requerimiento ambiguo porque no se indica si los comentarios deben ser moderados y si tienen límite de caracteres.',
    },
    {
      no: 5,
      text: 'El software dará informes mensuales acerca de las ventas y will be friendly for users.',
      isValid: false,
      feedback:
        "Este requerimiento mezcla dos idiomas y, además, es ambiguo. 'Amigable para los usuarios' no se define claramente. También falta especificar qué información contendrán los informes.",
    },
  ],
};

@Injectable({
  providedIn: 'root',
})
export class ContentGenerationService {
  private apiUrl = environment.apiUrl;

  private http = inject(HttpClient);

  constructor() {}

  getRequirements(): Observable<Requirement[]> {
    const url = `${this.apiUrl}/assistant/generate-requeriments`;

    // return this.http
    //   .get<RequirementsContentResponse>(url)
    //   .pipe(map((res) => res.requirements));

    return of(fakeContent.requirements).pipe(delay(1000));
  }
}
