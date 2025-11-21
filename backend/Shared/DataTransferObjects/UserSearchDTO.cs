namespace Shared.DataTransferObjects;

public class UserSearchDTO
{
    private string _query;
    private int _page = 1;
    private int _pageSize = 20;

    public string Query
    {
        get => _query;
        set
        {
            if (value is null)
                throw new ArgumentNullException();
            _query = value;
        } 
    }

    // public string Category { get; set; }
    // public decimal? MinPrice { get; set; }
    // public decimal? MaxPrice { get; set; }
    public int Page
    {
        get => _page;
        set
        {
            if (value < 0)
                throw new ArgumentException("Page cant less than 0");
            _page = value;
        }
    }

    public int PageSize
    {
        get => _page;
        set
        {
            if (value < 0)
                throw new ArgumentException("Page size cant less than 0");
            _page = value;
        }
    }
}