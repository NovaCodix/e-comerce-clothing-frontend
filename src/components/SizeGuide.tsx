import { motion } from "motion/react";
import { Ruler, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface SizeGuideProps {
  open: boolean;
  onClose: () => void;
}

export function SizeGuide({ open, onClose }: SizeGuideProps) {
  const womenSizes = [
    { size: "XS", bust: "81-84", waist: "63-66", hips: "89-92" },
    { size: "S", bust: "86-89", waist: "68-71", hips: "94-97" },
    { size: "M", bust: "91-94", waist: "73-76", hips: "99-102" },
    { size: "L", bust: "96-99", waist: "78-81", hips: "104-107" },
    { size: "XL", bust: "101-104", waist: "83-86", hips: "109-112" },
  ];

  const menSizes = [
    { size: "S", chest: "86-91", waist: "71-76", hips: "89-94" },
    { size: "M", chest: "94-99", waist: "79-84", hips: "97-102" },
    { size: "L", chest: "102-107", waist: "87-92", hips: "105-110" },
    { size: "XL", chest: "110-115", waist: "95-100", hips: "113-118" },
    { size: "XXL", chest: "118-123", waist: "103-108", hips: "121-126" },
  ];

  const tips = [
    "Mide tu cuerpo sin ropa para obtener medidas precisas",
    "Usa una cinta métrica flexible y no aprietes demasiado",
    "Pide ayuda a alguien para medir la espalda y los hombros",
    "Si estás entre dos tallas, elige la más grande para mayor comodidad",
    "Consulta las medidas específicas de cada producto",
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Ruler className="w-6 h-6 text-primary" />
            Guía de Tallas
          </DialogTitle>
          <DialogDescription>
            Encuentra tu talla perfecta con nuestras tablas de medidas detalladas
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="women" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="women">Mujer</TabsTrigger>
            <TabsTrigger value="men">Hombre</TabsTrigger>
          </TabsList>

          <TabsContent value="women" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h4 className="mb-4">Tallas de Mujer (cm)</h4>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Talla</TableHead>
                      <TableHead>Busto</TableHead>
                      <TableHead>Cintura</TableHead>
                      <TableHead>Cadera</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {womenSizes.map((row, index) => (
                      <motion.tr
                        key={row.size}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="">{row.size}</TableCell>
                        <TableCell>{row.bust}</TableCell>
                        <TableCell>{row.waist}</TableCell>
                        <TableCell>{row.hips}</TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="men" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h4 className="mb-4">Tallas de Hombre (cm)</h4>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Talla</TableHead>
                      <TableHead>Pecho</TableHead>
                      <TableHead>Cintura</TableHead>
                      <TableHead>Cadera</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {menSizes.map((row, index) => (
                      <motion.tr
                        key={row.size}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="">{row.size}</TableCell>
                        <TableCell>{row.chest}</TableCell>
                        <TableCell>{row.waist}</TableCell>
                        <TableCell>{row.hips}</TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-primary/10 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-primary" />
            <h4 className="">Consejos para Medir</h4>
          </div>
          <ul className="space-y-2">
            {tips.map((tip, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>{tip}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* How to Measure Image Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-muted/50 rounded-2xl p-6"
        >
          <h4 className="mb-4">Cómo Medir</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                <Ruler className="w-12 h-12 text-primary" />
              </div>
              <p className="">Busto/Pecho</p>
              <p className="text-muted-foreground text-xs">
                Mide alrededor de la parte más ancha del pecho
              </p>
            </div>
            <div className="space-y-2">
              <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                <Ruler className="w-12 h-12 text-purple-500" />
              </div>
              <p className="">Cintura</p>
              <p className="text-muted-foreground text-xs">
                Mide alrededor de la parte más estrecha de tu cintura
              </p>
            </div>
            <div className="space-y-2">
              <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
                <Ruler className="w-12 h-12 text-blue-500" />
              </div>
              <p className="">Cadera</p>
              <p className="text-muted-foreground text-xs">
                Mide alrededor de la parte más ancha de tus caderas
              </p>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
