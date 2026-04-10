# Multi-stage build for Render (repo root = Docker context; backend lives in ./backend)
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /build

COPY backend/pom.xml .
COPY backend/src ./src

RUN mvn -B clean package -DskipTests

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

COPY --from=build /build/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
