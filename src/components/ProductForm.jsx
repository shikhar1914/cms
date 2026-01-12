import { useState } from "react";
import { useProducts } from "../contexts/ProductContext";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CATEGORIES = ["Grains", "Seeds", "Oils", "Beverages", "Sweeteners", "Fibers", "Metals", "Minerals"];
const UNITS = ["kg", "liters", "bales", "tons", "pieces"];

export default function ProductForm({ product, onClose }) {
  const { addProduct, updateProduct } = useProducts();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: product?.name || "",
    category: product?.category || "",
    quantity: product?.quantity?.toString() || "",
    unit: product?.unit || "kg",
    price: product?.price?.toString() || "",
  });

  const isEditing = !!product;

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    const qty = parseFloat(formData.quantity);
    if (isNaN(qty) || qty < 0) {
      newErrors.quantity = "Valid quantity is required";
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      newErrors.price = "Valid price is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const productData = {
      name: formData.name.trim(),
      category: formData.category,
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      price: parseFloat(formData.price),
    };

    if (isEditing) {
      updateProduct(product.id, productData);
    } else {
      addProduct(productData);
    }

    setLoading(false);
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    // Use uncontrolled dialog opened by default. Call onClose only when dialog actually closes.
    <Dialog defaultOpen onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleChange("category", value)}
            >
              <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
                className={errors.quantity ? "border-destructive" : ""}
              />
              {errors.quantity && <p className="text-xs text-destructive">{errors.quantity}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => handleChange("unit", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (per unit)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className={`pl-7 ${errors.price ? "border-destructive" : ""}`}
              />
            </div>
            {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEditing ? "Saving..." : "Adding..."}
                </>
              ) : (
                isEditing ? "Save Changes" : "Add Product"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
