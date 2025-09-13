# Utiliser l'image officielle de .NET 8.0 runtime comme base
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Utiliser l'image SDK pour construire l'application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copier les fichiers de projet et restaurer les dépendances
COPY ["PersonalFinanceApp.csproj", "."]
RUN dotnet restore "PersonalFinanceApp.csproj"

# Copier le reste du code source
COPY . .

# Construire l'application
WORKDIR "/src"
RUN dotnet build "PersonalFinanceApp.csproj" -c Release -o /app/build

# Publier l'application
FROM build AS publish
RUN dotnet publish "PersonalFinanceApp.csproj" -c Release -o /app/publish

# Image finale
FROM base AS final
WORKDIR /app

# Copier les fichiers publiés
COPY --from=publish /app/publish .

# Créer un utilisateur non-root pour la sécurité
RUN adduser --disabled-password --gecos '' appuser && chown -R appuser /app
USER appuser

# Point d'entrée de l'application
ENTRYPOINT ["dotnet", "PersonalFinanceApp.dll"]