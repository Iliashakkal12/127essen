import { revenueByEmployee } from "@/data/finance";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function RevenueByEmployee() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employé</TableHead>
          <TableHead>Clients</TableHead>
          <TableHead>Revenu généré</TableHead>
          <TableHead>Commission</TableHead>
          <TableHead className="text-right">Commission due</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {revenueByEmployee.map((e) => (
          <TableRow key={e.name}>
            <TableCell>
              <div className="flex items-center gap-2.5">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary/10 text-xs text-primary">{e.initials}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{e.name}</span>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">{e.clients}</TableCell>
            <TableCell className="font-medium">{e.revenue.toLocaleString("fr-FR")} MAD</TableCell>
            <TableCell className="text-muted-foreground">{e.commissionPercent}%</TableCell>
            <TableCell className="text-right font-medium">{e.commissionOwed.toLocaleString("fr-FR")} MAD</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
