/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { TableComponent } from '@/components/Table';
import { EUrl, TCategory, TProduct, TServiceResponse } from '@/types';
import { DialogModal } from '@/components/DialogModal';
import { DynamicForm } from '@/components/DynamicForm';
import { useCreateData } from '@/hooks/useCreateData';
import { toast } from 'sonner';
import { useReadData } from '@/hooks/useReadData';
import { ProductSchema } from './ProductSchema';
import { productColumn } from '@/columns/ProductColumn';
import { ProductDTO } from '@/types/dto/ProductDTO';
import { categorySchemaGenerator, productSchemaGenerator } from './SchemaGenerator';
import { CategoryDTO } from '@/types/dto/CategoryDTO';
import { useDeleteData } from '@/hooks/useDeleteData';
import { useModifyData } from '@/hooks/useModifyData';
import { useReadDataWithBody } from '@/hooks/useReadDataWithBody';
import { QuerySpec } from '@/lib/query';
import { queryBuilder } from './queryBuilder';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';
import { Input } from '@/components/ui/input';
import { uploadData } from '@/api/services/uploadData';

const END_POINT = '/products';
const CATEGORY_END_POINT = '/categories';

export default function ProductCatalog() {

    const [open, setOpen] = useState<boolean>(false);
    const [openCategory, setOpenCategory] = useState<boolean>(false);
    const [actionItem, setActionItem] = useState<TProduct | string | null>(null);
    const [openWarn, setOpenWarn] = useState<boolean>(false);
    const [pagination, setPagination] = useState({
        pageSize: 10,
        pageIndex: 0
    });
    const [search, setSearch] = useState<string>('');
    const [uploading, setUploading] = useState<boolean>(false);
    const [deleteType, setDeleteType] = useState<'product' | 'category'>('product');

    const debouncedSearch = useDebounce(search, 300);

    const navigate = useNavigate();

    const { mutate: createProduct, isPending: createProductPending } = useCreateData<ProductDTO, TServiceResponse<TProduct>>(END_POINT);
    const { mutate: deleteProduct, isPending: deleteProductPending } = useDeleteData<TServiceResponse<void>>(END_POINT);
    const { mutate: updateProduct, isPending: updateProductPending } = useModifyData<ProductDTO & { id: string }, TServiceResponse<TProduct>>(END_POINT);

    const { mutate: createCategory, isPending: createCategoryPending } = useCreateData<CategoryDTO, TServiceResponse<TCategory>>(CATEGORY_END_POINT);
    const { mutate: deleteCategory, isPending: deleteCategoryPending } = useDeleteData<TServiceResponse<void>>(CATEGORY_END_POINT);

    const { data: res, isFetching, refetch, isError, error } =
        useReadDataWithBody<TServiceResponse<TProduct[]>, QuerySpec>(
            "product_list",
            `${END_POINT}/query`,
            queryBuilder(pagination, debouncedSearch)
        );
    const { data: categoryRes, isFetching: categoryLoading, refetch: refetchCategory } = useReadData<TServiceResponse<TCategory[]>>('category_list_fetch', CATEGORY_END_POINT);

    const handleDeleteCategory = (id: string) => {
        console.log("handleDeleteCategory called with ID: ", id);
        setActionItem(id);
        setDeleteType('category');
        setOpenWarn(true);
    };

    const confirmDeleteCategory = async () => {
        deleteCategory({
            id: actionItem as string
        }, {
            onSuccess: (res) => {
                if (res && res.success) {
                    toast.success('Category deleted successfully')
                    refetchCategory()
                    setOpenWarn(false)
                }
            },
            onError: (err) => {
                console.log('An error occured! ', err);
                toast.error(err.message || "Something went wrong")
            }
        })
    }

    const handleSubmit = async (
        data:
            | ProductSchema
            | {
                data: ProductSchema;
                files: FormData;
            }
    ) => {
        let payload: ProductDTO;

        if ("files" in data) {
            setUploading(true);
            const uploadRes = await uploadData<
                TServiceResponse<{
                    key: string;
                    url: string;
                }>
            >("/uploads/images", data.files);

            if (!uploadRes || !uploadRes.success || !uploadRes.data?.key) {
                toast.error(uploadRes?.message ?? "Could not upload image");
                return;
            }

            payload = {
                ...data.data,
                active: data.data.active === "true",
                price: parseFloat(data.data.price),
                image: uploadRes.data.key,
            };
        } else {
            payload = {
                ...data,
                active: data.active === "true",
                price: parseFloat(data.price),
                image: data.image ?? "",
            };
        }
        setUploading(false);
        if (actionItem) {
            if (!(actionItem as TProduct).id) {
                toast.error("An unknown error occurred");
                return;
            }

            updateProduct(
                {
                    id: (actionItem as TProduct).id!,
                    ...payload,
                },
                {
                    onSuccess: (res) => {
                        if (res?.success) {
                            toast.success("Product updated successfully");
                            refetch();
                            setOpen(false);
                        } else {
                            toast.error("An error occurred!");
                        }
                    },
                    onError: (err) => {
                        toast.error(err.message ?? "Something went wrong");
                    },
                }
            );
        } else {
            createProduct(payload, {
                onSuccess: (res) => {
                    if (res?.success) {
                        toast.success("Product added successfully");
                        refetch();
                        setOpen(false);
                    } else {
                        toast.error("An error occurred!");
                    }
                },
                onError: (err) => {
                    toast.error(err.message ?? "Something went wrong");
                },
            });
        }
    };

    const handleSubmitCategory = async (data: CategoryDTO) => {
        createCategory(
            data,
            {
                onSuccess: (res) => {
                    if (res && res.success) {
                        toast.success("Category added successfully");
                        refetchCategory();
                        setOpenCategory(false);
                    }
                    else {
                        toast.error("An error occured!");
                    }
                },
                onError: (err) => {
                    toast.error(err.message || "Something went wrong")
                }
            }
        )
    }

    const handleDelete = async () => {
        if (deleteType === 'product') {
            handleConfirmDeleteProduct();
        } else {
            confirmDeleteCategory();
        }
    };

    const handleConfirmDeleteProduct = async () => {
        deleteProduct({
            id: (actionItem as TProduct).id!
        }, {
            onSuccess: (res) => {
                if (res && res.success) {
                    toast.success('Product deleted successfully')
                    refetch()
                    setOpenWarn(false)
                }
            },
            onError: (err) => {
                console.log('An error occured! ', err);
                toast.error(err.message ?? 'An unknown error occured');
            }
        })
    }

    if (isError) {
        const status = (error as any)?.response?.status || (error as any)?.status;
        if (status === 401 || status === 403) {
            toast.error('You are not authorized to access this page');
            navigate(EUrl.ADMIN_LOGIN);
        }
        else {
            toast.error(error?.message ?? 'An unknown error occured');
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className='flex flex-col gap-1 items-start'>
                    <h2 className="text-xl font-semibold text-foreground">Products</h2>
                    {
                        res?.count ? <p className="text-muted-foreground">{res?.count} Products</p> : null
                    }
                </div>
                <Button onClick={() => {
                    setActionItem(null)
                    setOpen(true)
                }}>
                    <Plus className="h-4 w-4" />
                    Add Product
                </Button>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search by product name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            <Card>
                <CardContent className="p-0">
                    <TableComponent<TProduct>
                        data={res?.data || []}
                        columns={productColumn}
                        getRowId={(row) => row.id!}
                        onClickDelete={(row) => {
                            setActionItem(row)
                            setDeleteType('product')
                            setOpenWarn(true)
                        }}
                        isLoading={isFetching}
                        totalItems={res?.count || 10}
                        pagination={pagination}
                        onPaginationChange={(pagination) => {
                            setPagination(pagination)
                        }}
                        onClickEdit={(row) => {
                            console.log("Row: ", row);
                            setActionItem(row)
                            setOpen(true)
                        }}
                    />
                </CardContent>
            </Card>
            <DialogModal
                open={open}
                onOpenChange={setOpen}
                title="Add Product"
                description="Create a new product."
            >
                <DynamicForm<ProductSchema>
                    schema={productSchemaGenerator(categoryLoading, setOpenCategory, handleDeleteCategory, deleteCategoryPending, categoryRes)}
                    onSubmit={(data: ProductSchema) => handleSubmit(data)}
                    loading={createProductPending || updateProductPending || uploading}
                    defaultValues={
                        {
                            name: (actionItem as TProduct)?.name,
                            sku: (actionItem as TProduct)?.sku,
                            image: (actionItem as TProduct)?.image,
                            measureUnit: (actionItem as TProduct)?.measureUnit,
                            packageType: (actionItem as TProduct)?.packageType,
                            categoryId: (actionItem as TProduct)?.categoryId?.id,
                            price: (actionItem as TProduct)?.price,
                            active: "true"
                        }
                    }
                />
            </DialogModal>
            <DialogModal
                open={openCategory}
                onOpenChange={setOpenCategory}
                title="Add Category"
                description="Create a new category."
            >
                <DynamicForm<CategoryDTO>
                    schema={categorySchemaGenerator()}
                    onSubmit={(data: CategoryDTO) => handleSubmitCategory(data)}
                    loading={createCategoryPending}
                />
            </DialogModal>
            <DialogModal
                open={openWarn}
                onOpenChange={setOpenWarn}
                onConfirm={handleDelete}
                cancelText="Cancel"
                title={deleteType === 'product' ? 'Delete Product' : 'Delete Category'}
                isDelete={true}
                onCancel={() => setOpenWarn(false)}
                isLoading={deleteProductPending || deleteCategoryPending}
            >
                <div className='items-center flex flex-col py-5'>
                    <h1>Are you sure you want to delete this {deleteType === 'product' ? 'product' : 'category'}?</h1>
                    <p>This action cannot be undone.</p>
                </div>
            </DialogModal>
        </div>
    );
}
