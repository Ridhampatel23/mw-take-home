using backend.models;

namespace backend.Mappers;

using backend.data;

public static class ProgramsMapper
{
    public static Programs ToEntity(CreateProgramRequest r) => new() {
        Name = r.Name, Description = r.Description, StartDate = r.StartDate, EndDate = r.EndDate
    };

    public static void ApplyUpdate(Programs e, UpdateProgramRequest r) {
        e.Name = r.Name; e.Description = r.Description; e.StartDate = r.StartDate; e.EndDate = r.EndDate;
    }

    public static ProgramResponse ToResponse(Programs e) =>
        new(e.Id, e.Name, e.Description, e.StartDate, e.EndDate);
}