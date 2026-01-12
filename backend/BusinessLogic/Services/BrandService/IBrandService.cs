using DataAccess.Models;
using Shared.DataTransferObjects.Request.BrandDto;
using Shared.DataTransferObjects.Response;

namespace BusinessLogic.Services.BrandService;

public interface IBrandService : 
    ICrudService<Brand, BrandLinkedDto, BrandCreateDto, BrandUpdateDto>, 
    IManyService<Brand, BrandLinkedDto, BrandSearchDto>
{ }