using DataAccess.Models;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.Response;

namespace BusinessLogic.Services;

public interface IBrandService : 
    ICrudService<BrandLinkedDto, BrandCreateDto, BrandUpdateDto>, 
    IManyService<Brand, BrandLinkedDto, BrandSearchDto>
{ }