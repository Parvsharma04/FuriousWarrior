import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

type Product = {
  item_id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  available_stock: number;
  document_url?: string;
};

type ProductCardProps = {
  product: Product;
  handleEdit: (product: Product) => void;
  onDelete: (id: string) => void;
};

export default function ProductCard({
  product,
  handleEdit,
  onDelete,
}: ProductCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
        <p className="font-semibold">${product.price.toFixed(2)}</p>
        <p className="text-sm text-gray-500">Category: {product.category}</p>
        <p className="text-sm text-gray-500">
          Available Stock: {product.available_stock}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(product.item_id)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
        {product.document_url && (
          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-4xl h-[80vh]">
              <DialogHeader>
                <DialogTitle>{product.title} - Document Preview</DialogTitle>
              </DialogHeader>
              <iframe
                src={product.document_url}
                className="w-full h-full"
                title={`${product.title} document preview`}
              />
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  );
}
