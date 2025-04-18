# См. статью по ссылке https://aka.ms/customizecontainer, чтобы узнать как настроить контейнер отладки и как Visual Studio использует этот Dockerfile для создания образов для ускорения отладки.

# Этот этап используется при запуске из VS в быстром режиме (по умолчанию для конфигурации отладки)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

USER root
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*


USER app

# Этот этап используется для сборки проекта службы
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["BYTUBE.csproj", "."]
RUN dotnet restore "./BYTUBE.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "./BYTUBE.csproj" -c $BUILD_CONFIGURATION -o /app/build

RUN mkdir -p /app/Data && chown -R app:app /app/Data

# Этот этап используется для публикации проекта службы, который будет скопирован на последний этап
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./BYTUBE.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Этот этап используется в рабочей среде или при запуске из VS в обычном режиме (по умолчанию, когда конфигурация отладки не используется)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Копируем сертификат в контейнер
COPY ./BYTUBE.pfx /https/BYTUBE.pfx

# Настройка переменных среды для использования сертификата
ENV ASPNETCORE_Kestrel__Certificates__Default__Path=/https/BYTUBE.pfx
ENV ASPNETCORE_Kestrel__Certificates__Default__Password=BYTYBE

ENTRYPOINT ["dotnet", "BYTUBE.dll"]