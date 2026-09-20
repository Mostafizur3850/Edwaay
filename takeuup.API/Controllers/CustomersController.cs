using ECommerce.Application.Service;
using Microsoft.AspNetCore.Authorization;
using ECommerce.API.Filters;
using Microsoft.AspNetCore.Mvc;
[ApiController]
[Route("api/admin/customers")]
[Authorize]
    [HasPermission]
    public class CustomersController : ControllerBase
{
    private readonly ICustomerService _customerService;
    public CustomersController(ICustomerService customerService)
    {
        _customerService = customerService;
    }
    // ✅ GET: api/admin/customers
    [HttpGet]
    public async Task<IActionResult> GetCustomers()
    {
        var data = await _customerService.GetCustomersAsync();
        return Ok(data);
    }
    // ✅ GET: api/admin/customers/{userId}
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetCustomer(Guid userId)
    {
        var customer = await _customerService.GetCustomerByUserIdAsync(userId);
        if (customer == null)
            return NotFound();
        return Ok(customer);
    }
    // ✅ DELETE: api/admin/customers/{userId}
    [HttpDelete("{userId}")]
    public async Task<IActionResult> DeleteCustomer(Guid userId)
    {
        await _customerService.DeleteCustomerAsync(userId);
        return NoContent();
    }
}
