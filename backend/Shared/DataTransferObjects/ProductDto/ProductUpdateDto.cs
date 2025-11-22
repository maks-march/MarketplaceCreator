namespace Shared.DataTransferObjects;

public class ProductUpdateDto : BaseDto
{
    public string? Title { get; set; } = null;
    public string? Description { get; set; } = null;
}