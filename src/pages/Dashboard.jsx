import { useProducts } from "../contexts/ProductContext";
import { 
  Package, 
  DollarSign, 
  AlertTriangle, 
  XCircle, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Layers
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

function StatCard({ title, value, icon: Icon, trend, trendUp, color }) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trendUp ? "text-success" : "text-destructive"}`}>
              {trendUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { products, stats } = useProducts();

  // Prepare chart data
  const categoryData = products.reduce((acc, product) => {
    const existing = acc.find((item) => item.name === product.category);
    if (existing) {
      existing.value += product.quantity;
      existing.totalValue += product.quantity * product.price;
    } else {
      acc.push({
        name: product.category,
        value: product.quantity,
        totalValue: product.quantity * product.price,
      });
    }
    return acc;
  }, []);

  const stockStatusData = [
    { name: "In Stock", value: products.filter((p) => p.status === "in-stock").length, color: "hsl(var(--success))" },
    { name: "Low Stock", value: products.filter((p) => p.status === "low-stock").length, color: "hsl(var(--warning))" },
    { name: "Out of Stock", value: products.filter((p) => p.status === "out-of-stock").length, color: "hsl(var(--destructive))" },
  ].filter((d) => d.value > 0);

  const topProducts = [...products]
    .sort((a, b) => b.quantity * b.price - a.quantity * a.price)
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your commodities inventory</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          trend="+12% from last month"
          trendUp={true}
          color="bg-primary/10 text-primary"
        />
        <StatCard
          title="Total Value"
          value={`$${stats.totalValue.toLocaleString()}`}
          icon={DollarSign}
          trend="+8.5% from last month"
          trendUp={true}
          color="bg-success/10 text-success"
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStock}
          icon={AlertTriangle}
          trend="Needs attention"
          trendUp={false}
          color="bg-warning/10 text-warning"
        />
        <StatCard
          title="Out of Stock"
          value={stats.outOfStock}
          icon={XCircle}
          trend="Requires restocking"
          trendUp={false}
          color="bg-destructive/10 text-destructive"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Inventory by Category</h2>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock Status Pie */}
        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Stock Status</h2>
          </div>
          <div className="h-[280px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {stockStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {stockStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                  <span className="text-sm font-medium ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-card rounded-xl border p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Top Products by Value</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Product</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Quantity</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Unit Price</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product) => (
                <tr key={product.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-medium">{product.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{product.category}</td>
                  <td className="py-3 px-4 text-right">{product.quantity.toLocaleString()} {product.unit}</td>
                  <td className="py-3 px-4 text-right">${product.price.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right font-medium">${(product.quantity * product.price).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
