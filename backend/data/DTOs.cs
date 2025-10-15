namespace backend.data;

using backend.models; // for Roles ENUM

public record CreatePersonRequest(string FirstName, string LastName, string Email, Role Role);

public record UpdatePersonRequest(string FirstName, string LastName, string Email, Role Role);

public record CreateProgramRequest(string Name, string Description, DateOnly StartDate, DateOnly EndDate);

public record UpdateProgramRequest(string Name, string Description, DateOnly StartDate, DateOnly EndDate);

public record AssignPeopleRequest(List<Guid> PersonIds);

public record PersonResponse(Guid Id, string FirstName, string LastName, string Email, Role Role, DateTime CreatedAt);

public record ProgramResponse(Guid Id, string Name, string Description, DateOnly StartDate, DateOnly EndDate);

public record AssignResultResponse(Guid ProgramId, List<Guid> Assigned, List<Guid> AlreadyAssigned);