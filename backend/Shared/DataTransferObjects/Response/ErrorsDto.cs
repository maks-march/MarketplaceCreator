namespace Shared.DataTransferObjects.Response;

public class ErrorsDto : BaseDto
{
    public Dictionary<string, IEnumerable<string>> Errors { get; set; } = new Dictionary<string,IEnumerable<string>>();
}