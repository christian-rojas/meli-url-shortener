# meli-url-shortener
## un acortador de url escalable

el propósito de este repositorio es exponer una aplicación con un diseño robusto y escalable en el tiempo, el cual tiene como funcionalidad principal reducir el largo total de la cadena de una URL.

El sistema esta compuesto por las siguientes tecnologías:

- Node JS 16
- Docker
- AWS DynamoDB
- AWS VPC: region us-east-1
- AWS cloudfront
- AWS LoadBalancer
- AWS ECS
- AWS ECR
- AWS SecretManager
- AWS Cloudwatch
- newrelic

La aplicación esta basada en la libreria fastify de nodejs y dispone de 4 endpoints:
- v1/create [method: POST, req: longUrl]
- v1/delete [method: POST, req: longUrl]
- v1/urls [method: POST, req: url]
- v1/base [method: GET, param: base62]

incorpora un sistema de cluster/workers que permiten concurrencia de requests dentro de la aplicación.
además distribuye la carga por los distintos containers gracias a la implementación de LoadBalancer dentro del entorno de AWS.

funciona a través de un CDN (cloudfront) que a su vez protege la aplicación de DDos aplicando Rate Limiter en cache de origin.

el monitoreo de infraestructura (metricas de carga y memoria) esta a cargo de Cloudwatch y el monitoreo de API con newrelic.
## ejecutar en entorno DEV
npm run dev
