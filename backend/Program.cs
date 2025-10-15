using backend.data;
using backend.models;
using backend.services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;
using Serilog;



var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddControllers().AddJsonOptions(o =>
{
    o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()); // "Admin" works
});

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultPostgreSQL")));

builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins("http://localhost:4200", "http://localhost:4201")
        .AllowAnyHeader().AllowAnyMethod()
));

builder.Host.UseSerilog((context, services, configuration) =>
{
    configuration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext();
});



builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo {
        Title = "MemberWorks API",
        Version = "v1",
        Description = "People & Programs API"
    });

    
    var xml = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xml);
    if (File.Exists(xmlPath))
        c.IncludeXmlComments(xmlPath, includeControllerXmlComments: true);
});

builder.Services.AddScoped<PeopleService>();
builder.Services.AddScoped<ProgramsService>();

var app = builder.Build();

app.UseCors();

app.MapGet("/", () =>
{
    Log.Verbose("Verbose message");
    Log.Debug("Debug message");
    Log.Information("Information message");
    Log.Warning("Warning message");
    Log.Error("Error message");
    Log.Fatal("Fatal message");
    return "Check your console logs!";
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(o =>
    {
        o.SwaggerEndpoint("/swagger/v1/swagger.json", "MemberWorks API v1");
        o.RoutePrefix = "swagger"; // UI at /swagger
    });
}

app.MapControllers();
app.UseHttpsRedirection();

app.Run();




