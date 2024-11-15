export const enum ResponseMessages{
    S1 = 'Template api service is up & running',
    UA = 'Unauthorised user',
    UAuthenticate = "User dosen't have permission to this data",
    BR = "Bad Request",
    PE= "Failed to insert the data",
    PutE = "Failed to update the data",
 DE= "Failed to delete the row",
 GE= "Failed to fetch the data",
 UE= "Internal server error",

 CExist= "Data already exist",
 CNot= 'Category not found',

 CP= "Category created sucessfully",
 CG= "Category fetched successfully",
 CPut= 'Category updated sucessfully',
 CD= 'Category deleted sucessfully',

 EExist= 'Expense already exist with same data',
 ENExist= 'Expense does not exist',
 EPE='Failed to create an expense',
    
 GS= "Data fetched successfully",
 PS= "New row inserted",
PutS= "Row updated",
DS= "Row deleted",

DataNot= "Data not found",
    
RExist= "Task with same name already exist",

DExist="Data already Exist", 
INVALID= "Invalid details provided",

TagLimit= "Maximum limit reached, you can't tag more than 50 items"
}