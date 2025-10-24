using Microsoft.AspNetCore.Mvc;
using backend.services;
using backend.data;

namespace backend.controllers;

[ApiController]
[Route("programs")]
public class ProgramsController : ControllerBase
{
    private readonly ProgramsService _svc;
    public ProgramsController(ProgramsService svc) => _svc = svc;

    /// <summary>
    /// Gets all programs.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAllPrograms() => Ok(await _svc.GetAllPrograms());

    /// <summary>
    /// Gets a program by its unique ID.
    /// </summary>
    /// <param name="id">The ID of the program.</param>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
        => (await _svc.GetProgramById(id)) is { } p ? Ok(p) : NotFound();

    /// <summary>
    /// Gets the IDs of people assigned to a specific program.
    /// </summary>
    /// <param name="programId">The ID of the program.</param>
    [HttpGet("{programId:guid}/people/ids")]
    public async Task<IActionResult> GetAssignedPeopleIds(Guid programId)
    {
        return Ok(await _svc.GetAssignedPeopleIds(programId));
    }
    
    /// <summary>
    /// Creates a new program.
    /// </summary>
    /// <param name="req">The program details to create.</param>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProgramRequest req)
    {
        var created = await _svc.CreateProgram(req);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>
    /// Updates an existing program.
    /// </summary>
    /// <param name="id">The ID of the program to update.</param>
    /// <param name="req">The updated program data.</param>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateProgram(Guid id, [FromBody] UpdateProgramRequest req)
        => (await _svc.UpdateProgramById(id, req)) is { } p ? Ok(p) : NotFound();

    /// <summary>
    /// Deletes a program by ID.
    /// </summary>
    /// <param name="id">The ID of the program to delete.</param>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteProgram(Guid id)
        => await _svc.DeleteProgramById(id) ? NoContent() : NotFound();

    
    /// <summary>
    /// Assigns people to a program.
    /// </summary>
    /// <param name="id">The ID of the program.</param>
    /// <param name="req">The list of people to assign.</param>
    /// Legacy endpoint, use /ProgramId/assignments instead.
    [HttpPost("{id:guid}/assign")]
    public async Task<IActionResult> AssignPeopleToProgram(Guid id, [FromBody] AssignPeopleRequest req)
        => Ok(await _svc.AssignPeopleAsync(id, req));

    /// <summary>
    /// Removes a person from a program.
    /// </summary>
    /// <param name="id">The ID of the program.</param>
    /// <param name="personId">The ID of the person to remove.</param>
    /// Legacy endpoint, use /ProgramId/assignments instead.
    [HttpDelete("{id:guid}/remove/{personId:guid}")]
    public async Task<IActionResult> RemovePeople(Guid id, Guid personId)
        => await _svc.RemovePersonFromProgram(id, personId) ? NoContent() : NotFound();
    
    /// <summary>Replaces the full assignment set for this program.</summary>
    [HttpPut("{ProgramId:guid}/assignments")]
    public async Task<IActionResult> SetAssignments(Guid ProgramId, [FromBody] AssignPeopleRequest req)
    {
        var (added, removed) = await _svc.SetAssignmentsAsync(ProgramId, req);
        return Ok(new { added, removed });
    }

    
}