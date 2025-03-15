using ClientsStatsWeb.Components;

using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using dotenv.net;
using Firebase.Database;

DotEnv.Load(); // Loads .env file automatically


var builder = WebApplication.CreateBuilder(args);


// Get Firebase credentials path from the .env file
var firebaseCredentialsPath = Environment.GetEnvironmentVariable("FIREBASE_CREDENTIALS_PATH");
var firebaseDatabaseUrl = Environment.GetEnvironmentVariable("FIREBASE_DATABASE_URL");

if (string.IsNullOrEmpty(firebaseCredentialsPath) || string.IsNullOrEmpty(firebaseDatabaseUrl))
{
    throw new InvalidOperationException("Firebase environment variables are not set properly.");
}

if (FirebaseApp.DefaultInstance == null)
{
    FirebaseApp.Create(new AppOptions()
    {
        Credential = GoogleCredential.FromFile(firebaseCredentialsPath),
    });
}

// Register Firebase Realtime Database client as a singleton service
builder.Services.AddSingleton(provider => new FirebaseClient(firebaseDatabaseUrl));




// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
}

app.UseStaticFiles();
app.UseAntiforgery();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();



app.Run();
