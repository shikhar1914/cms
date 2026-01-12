import { useState } from "react";
import { useProducts } from "../contexts/ProductContext";
import { useAuth } from "../contexts/AuthContext";
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Filter,
  Package,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductForm from "../components/ProductForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function StatusBadge({ status }) {
  const styles = {
    "in-stock": "bg-success/10 text-success border-success/20",
    "low-stock": "bg-warning/10 text-warning border-warning/20",
    "out-of-stock": "bg-destructive/10 text-destructive border-destructive/20",
  };

  const labels = {
    "in-stock": "In Stock",
    "low-stock": "Low Stock",
    "out-of-stock": "Out of Stock",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export default function Products() {
  const { products, deleteProduct } = useProducts();
  const { isManager, isStoreKeeper } = useAuth();
  // Debug: log auth roles in console to help diagnose visibility/click issues
  // (will appear in browser console)
  // eslint-disable-next-line no-console
  console.log('Auth - isManager:', isManager(), 'isStoreKeeper:', isStoreKeeper());
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const categories = ["all", ...new Set(products.map((p) => p.category))];
  const statuses = ["all", "in-stock", "low-stock", "out-of-stock"];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  const handleFormClose = () => {
    // Debug: log closing form
    // eslint-disable-next-line no-console
    console.log('Product form closed');
    setShowForm(false);
    setEditingProduct(null);
  };

  const canModify = isManager() || isStoreKeeper();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your commodity inventory</p>
        </div>
        {canModify && (
            <Button onClick={() => {
              // Debug: log click
              // eslint-disable-next-line no-console
              console.log('Add Product button clicked');
              setShowForm(true);
            }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[140px] justify-between">
              <Filter className="w-4 h-4 mr-2" />
              {categoryFilter === "all" ? "All Categories" : categoryFilter}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {categories.map((cat) => (
              <DropdownMenuItem key={cat} onClick={() => setCategoryFilter(cat)}>
                {cat === "all" ? "All Categories" : cat}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[140px] justify-between">
              {statusFilter === "all" ? "All Status" : statusFilter.replace("-", " ")}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {statuses.map((status) => (
              <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)}>
                {status === "all" ? "All Status" : status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Products Table */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Product</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Category</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Quantity</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Price</th>
                <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                {canModify && (
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={canModify ? 6 : 5} className="py-12 text-center">
                    <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">No products found</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-t hover:bg-muted/20 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium">{product.name}</div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">{product.category}</td>
                    <td className="py-4 px-4 text-right">
                      {product.quantity.toLocaleString()} {product.unit}
                    </td>
                    <td className="py-4 px-4 text-right font-medium">${product.price.toFixed(2)}</td>
                    <td className="py-4 px-4 text-center">
                      <StatusBadge status={product.status} />
                    </td>
                    {canModify && (
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(product)}
                            className="hover:bg-primary/10 hover:text-primary"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirm(product)}
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Dialog */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleFormClose}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirm?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(deleteConfirm?.id)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
