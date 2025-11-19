#FROM adoptopenjdk/openjdk11:armv7l-ubuntu-jre-11.0.11_9
FROM amazoncorretto:17-alpine

WORKDIR /app

COPY target/application-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

CMD ["java", "-Xmx512m", "-jar", "app.jar"]