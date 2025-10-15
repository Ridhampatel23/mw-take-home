using backend.models;
using Microsoft.AspNetCore.Mvc;
using backend.services;
using backend.data;

namespace backend.controllers;

[ApiController]
[Route("people")]
public class PeopleController : ControllerBase
{
    private readonly PeopleService _svc;
    public PeopleController(PeopleService svc) => _svc = svc;

    /// <summary>
    /// Gets all people.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetPeople()
        => Ok(await _svc.GetAllPeople());

    /// <summary>
    /// Gets a person by their unique ID.
    /// </summary>
    /// <param name="id">The ID of the person.</param>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
        => (await _svc.GetPersonById(id)) is { } p ? Ok(p) : NotFound();

    /// <summary>
    /// Creates a new person.
    /// </summary>
    /// <param name="req">The person details to create.</param>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePersonRequest req)
    {
        var created = await _svc.CreatePerson(req);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }
    

    
    /// <summary>
    /// Updates an existing person.
    /// </summary>
    /// <param name="id">The ID of the person to update.</param>
    /// <param name="req">The updated person data.</param>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateById(Guid id, [FromBody] UpdatePersonRequest req)
        => (await _svc.UodatePersonById(id, req)) is { } p ? Ok(p) : NotFound();

    /// <summary>
    /// Deletes a person by ID.
    /// </summary>
    /// <param name="id">The ID of the person to delete.</param>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeletePerson(Guid id)
        => await _svc.DeletePersonById(id) ? NoContent() : NotFound();
}