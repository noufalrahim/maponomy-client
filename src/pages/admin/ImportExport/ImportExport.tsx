/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Download, Upload, FileSpreadsheet, Users, Store, Package, Warehouse, CalendarIcon, Info, ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';

const importOptions = [
  {
    name: 'Sales',
    description: 'Import sales representatives',
    icon: Users,
    notes: [
      'Role must be set to: salesperson',
      'Phone number must be unique',
      'Email must be unique',
      'active must be: true or false',
    ],
  },
  {
    name: 'Customers',
    description: 'Import customer list with warehouse mapping',
    icon: Store,
    notes: [
      'Email must be unique',
      'Phone number must be unique',
      'type must be: own or external',
      'active must be: true or false',
    ],
  },
  {
    name: 'Warehouses',
    description: 'Import warehouse list',
    icon: Warehouse,
    notes: [
      'active must be: true or false',
    ],
  },
  {
    name: 'Products',
    description: 'Import product catalog',
    icon: Package,
    notes: [
      'active must be: true or false',
    ],
  },
  {
    name: 'Orders',
    description: 'Import customer orders',
    icon: ShoppingCart,
    notes: [
      'vendor_id is required',
      'delivery_date must be YYYY-MM-DD format',
      'start_time and end_time must be HH:MM format',
      'product_id is required',
      'quantity and amount must be valid numbers',
      'Multiple items for the same order must have the exact same vendor_id, warehouse_id, delivery_date, start_time, and end_time'
    ],
  },
];

const exportOptions = [
  { key: 'sales', name: 'Sales', description: 'Export sales team data' },
  { key: 'customers', name: 'Customers', description: 'Export all customers with warehouse info' },
  { key: 'warehouses', name: 'Warehouses', description: 'Export all warehouses' },
  { key: 'products', name: 'Products', description: 'Export product catalog' },
  { key: 'orders', name: 'Orders', description: 'Export all orders' },
  { key: 'routeOptimisationOrders', name: 'Route Optimization (Orders)', description: 'Export for route optimization' }
];

export default function ImportExport() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImportType, setSelectedImportType] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedNotes, setExpandedNotes] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const toggleNotes = (name: string) => {
    setExpandedNotes(prev => (prev === name ? null : name));
  };

  const handleImport = (name: string) => {
    setSelectedImportType(name);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedImportType) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', selectedImportType);

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Unauthorized");
      }

      const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/uploads/import`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Import failed');
      }

      const result = await res.json();

      toast.success("Import completed successfully", {
        description: `Inserted ${result?.data?.inserted ?? 0} of ${result?.data?.total ?? 0} records. Skipped ${result?.data?.failed ?? 0}. found ${result?.data?.existing ?? 0} already existing records`,
      });

    } catch (err: any) {
      toast.error('Import failed', {
        description: err.message,
      });
    } finally {
      setLoading(false);
      setSelectedImportType(null);
      e.target.value = '';
    }
  };


  const handleExport = async (key: string) => {
    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Please select a date range");
      return;
    }
    // if (dateRange?.to && dateRange?.from) {
    //   const diff = dateRange?.to.getTime() - dateRange?.from.getTime();
    //   const maxRange = 7 * 24 * 60 * 60 * 1000;

    //   if (diff > maxRange) {
    //     toast.error("Date range should be less than 7 days");
    //     return;
    //   }
    // }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Unauthorized");
      }

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/uploads/exports`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: key,
            from: format(dateRange?.from ?? new Date(), "yyyy-MM-dd"),
            to: format(dateRange?.to ?? new Date(), "yyyy-MM-dd"),
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Export failed");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${key.toLowerCase()}_export.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Export completed", {
        description: `${key} data downloaded successfully`,
      });
    } catch (err: any) {
      toast.error("Export failed", {
        description: err.message,
      });
    }
  };


  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadTemplate = (name: string) => {
    let headers = "";
    let filename = "";

    switch (name) {
      case "Sales":
        headers =
          "email,password,name,phone_number,monthly_target,active\n";
        filename = "sales_import_template.csv";
        break;

      case "Customers":
        headers =
          "name,address,phone_number,email,password,warehouse_id,latitude,longitude,type,store_image,active,salespersonid\n";
        filename = "customers_import_template.csv";
        break;

      case "Warehouses":
        headers =
          "name,address,latitude,longitude,active\n";
        filename = "warehouses_import_template.csv";
        break;

      case "Products":
        headers =
          "category_name,name,measure_unit,package_type,price,quantity_sold,sku,active\n";
        filename = "products_import_template.csv";
        break;

      case "Orders":
        headers =
          "vendor_id,warehouse_id,delivery_date,start_time,end_time,product_id,quantity\n";
        filename = "orders_import_template.csv";
        break;

      default:
        toast.error("No template available for this type");
        return;
    }

    downloadCSV(headers, filename);

    toast.success("Template downloaded", {
      description: `${name} import template (headers only)`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-col">
        <h2 className="text-xl font-semibold">Import / Export</h2>
        <p className="text-muted-foreground">Bulk data management via Excel/CSV</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className='flex items-start flex-col'>
            <CardTitle>Import Data</CardTitle>
            <CardDescription>Upload CSV / Excel files</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {importOptions.map(option => (
              <div key={option.name} className="border rounded-lg overflow-hidden">
                <div className="flex justify-between items-center p-4">
                  <div className="flex gap-3 items-center">
                    <option.icon className="h-5 w-5" />
                    <div className='flex items-start text-start flex-col'>
                      <p className="font-medium">{option.name}</p>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleNotes(option.name)}
                      title="View import notes"
                    >
                      <Info className="h-4 w-4 text-muted-foreground" />
                      {expandedNotes === option.name ? (
                        <ChevronUp className="h-3 w-3 ml-1 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-3 w-3 ml-1 text-muted-foreground" />
                      )}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownloadTemplate(option.name)}>
                      <FileSpreadsheet className="h-4 w-4" />
                      Template
                    </Button>
                    <Button size="sm" disabled={loading} onClick={() => handleImport(option.name)}>
                      <Upload className="h-4 w-4" />
                      Import
                    </Button>
                  </div>
                </div>
                {expandedNotes === option.name && (
                  <div className="bg-muted/40 border-t px-4 py-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Guidelines for uploading {option.name} data</p>
                    <ul className="space-y-1">
                      {option.notes.map((note, i) => (
                        <li key={i} className="flex items-center just gap-2 text-sm text-muted-foreground">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex items-start flex-row justify-between'>
            <div className='flex flex-col items-start'>
              <CardTitle>Export Data</CardTitle>
              <CardDescription>Download reports</CardDescription>
            </div>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {dateRange?.from
                      ? dateRange.to
                        ? `${format(dateRange.from, "dd MMM")} – ${format(
                          dateRange.to,
                          "dd MMM"
                        )}`
                        : format(dateRange.from, "dd MMM")
                      : "Date range (Created)"}

                  </Button>
                </PopoverTrigger>

                <PopoverContent align="start" className="p-0">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {exportOptions.map(option => (
              <div
                key={option.name}
                className="flex justify-between items-center border p-4 rounded-lg"
              >
                <div className='flex flex-col items-start'>
                  <p className="font-medium">{option.name}</p>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleExport(option.key)}>
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
