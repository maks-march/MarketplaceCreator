namespace Shared.Exceptions;

public class NotFoundException : Exception
{
    public NotFoundException(string noProductFound) => throw new Exception(noProductFound);
}