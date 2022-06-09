# proyectoFinalDockerPC2

# PASOS INICIALES

1. Clonar

```
git clone https://github.com/karou1182001/proyectoFinalDockerPC2.git
```

2. cd proyectoFinalDockerPC2

3. docker-compose up -d
(Si el puerto de la appi se llega a apagar, correr: docker-compose up -d appi)

#  PASOS PARA HACER LAS CONSULTAS


1. Un método que devuelve un ok si la conexión de la base de datos es exitosa y un nok en caso contrario:
Corra:

curl http://ip172-18-0-125-cah2m4k33d5g00d0o1d0-3000.direct.labs.play-with-docker.com/connect

2. Obteniendo como parámetro un id de usuario devolver un hash (combine el id con el timestamp). Almacena en la base de datos el id, timestamp y hash (tabla s). El hash solo tendrá una validez de cuatro horas.

Ejemplo:

curl http://ip172-18-0-125-cah2m4k33d5g00d0o1d0-3000.direct.labs.play-with-docker.com/consulta/100


3. Obteniendo como parámetro un id y hash devolver un ok si el hash el válido y un nok en caso contrario. Almacenar en la base de datos el id, hash enviado, timestamp y la respuesta (tabla a).

Ejemplo:

curl http://ip172-18-0-125-cah2m4k33d5g00d0o1d0-3000.direct.labs.play-with-docker.com/consulta/100/1001654796267557

4. Devolver en formato JSON los datos almacenados en la tabla s

curl http://ip172-18-0-125-cah2m4k33d5g00d0o1d0-3000.direct.labs.play-with-docker.com/s

5. Devolver en formato JSON los datos almacenados en la tabla a

curl http://ip172-18-0-125-cah2m4k33d5g00d0o1d0-3000.direct.labs.play-with-docker.com/a

6. Borrar todos los elementos de tabla s y tabla a.

curl -X "DELETE" http://ip172-18-0-125-cah2m4k33d5g00d0o1d0-3000.direct.labs.play-with-docker.com/delete

PD: 
-Si quiere borra solo la tabla a:
curl -X "DELETE" http://ip172-18-0-125-cah2m4k33d5g00d0o1d0-3000.direct.labs.play-with-docker.com/a
-Si quiere borrar solo la tabla s
curl -X "DELETE" http://ip172-18-0-125-cah2m4k33d5g00d0o1d0-3000.direct.labs.play-with-docker.com/s





