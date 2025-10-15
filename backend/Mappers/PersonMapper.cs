using backend.data;
using backend.models;

namespace backend.Mappers;

public static class PersonMapper
{
    public static People ToEntity(CreatePersonRequest r) => new() {
        FirstName = r.FirstName, LastName = r.LastName, Email = r.Email, Role = r.Role
    };

    public static void ApplyUpdate(People e, UpdatePersonRequest r) {
        e.FirstName = r.FirstName; e.LastName = r.LastName; e.Email = r.Email; e.Role = r.Role;
    }

    public static PersonResponse ToResponse(People e) =>
        new(e.Id, e.FirstName, e.LastName, e.Email, e.Role, e.CreatedAt);
}