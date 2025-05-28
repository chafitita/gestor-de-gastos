
Caso de uso "Registrar categorización de dinero":
![registrar categorización de dinero](https://github.com/user-attachments/assets/a47f3439-836f-4805-ab6c-5ee463b8df33)
<br>
#### Descripción de CU
| flujo pricipal                                             | flujo alternativo                                                                                                                    |
|------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| 1. El usuario ingresa <br>a la web                         |                                                                                                                                      |
| 2. Ingresa un monto y <br>es mayor a 1                     | 2.1 Ingresa un monto y<br>es menor a 1<br>2.2 Se le notifica al<br>usuario que debe ingresar<br>un monto mayor a 1<br>2.3 FIN DEL CU |
| 3. Selecciona un tipo <br>de transacción                   |                                                                                                                                      |
| 4. Selecciona una categoría<br>de la lista                 | 4.1 Selecciona la opción<br>de "Agregar una categoría"<br>4.2 Extiende al CU "Crear<br>categoría"                                    |
| 5. Se le notifica que la<br>transacción a sido agregada    |                                                                                                                                      |
| 6. Se registra la nueva <br>transacción en el localstorage |                                                                                                                                      |
| 7. FIN DEL CU                                              |                                                                                                                                      |
|                                                            |                                                                                                                                      |

Caso de uso "Crear categoría"
![crear categoría](https://github.com/user-attachments/assets/83fc5281-ef51-4be0-9763-d6891a81ce0e)
<br>
#### Descripción de CU
| flujo pricipal                                                    | flujo alternativo                                                                                                                     |
|-------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| 1. El usuario ingresa <br>a la web                                |                                                                                                                                       |
| 2. Ingresa un monto                                               |                                                                                                                                       |
| 3. Selecciona un tipo<br>de transacción                           |                                                                                                                                       |
| 4. Selecciona la opción<br>"Agregar una categoría"                |                                                                                                                                       |
| 5. Clickea en la opción<br>de "Crear categoría"                   |                                                                                                                                       |
| 6. Ingresa el nombre de<br>la nueva categoría y esta<br>no existe | 6.1 Ingresa el nombre de<br>la nueva categoría y esta<br>existe<br>6.2 Se le notifica que la<br>categoría ya existe<br>6.3 FIN DEL CU |
| 7. Se registra la nueva <br>categoría en el localstorage          |                                                                                                                                       |
| 8. FIN DEL CU                                                     |                                                                                                                                       |

#### Test:
[Planilla de testeos](https://docs.google.com/spreadsheets/d/1DXB9XJ65iz6PfVFWiciyzDRo-oDrGlB91sCZZRegKWw/edit?usp=sharing)
[Planilla de testeos](https://docs.google.com/spreadsheets/d/1DXB9XJ65iz6PfVFWiciyzDRo-oDrGlB91sCZZRegKWw/edit?usp=sharing)
