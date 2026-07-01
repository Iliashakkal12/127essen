import { expenses } from "@/data/finance";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function ExpensesTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Dépense</TableHead>
          <TableHead>Catégorie</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Montant</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((e) => (
          <TableRow key={e.id}>
            <TableCell className="font-medium">{e.label}</TableCell>
            <TableCell>
              <Badge variant="secondary" className="font-normal">{e.category}</Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(e.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
            </TableCell>
            <TableCell className="text-right font-medium">{e.amount.toLocaleString("fr-FR")} MAD</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
