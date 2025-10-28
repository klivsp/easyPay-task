import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, CornerDownLeft } from "lucide-react";

export interface ConfirmationModalProps {
  id?: number;
  title: string;
  description: string;
  cancel?: string;
  submit?: string;
  handleSubmit: () => void;
  isLoading?: boolean;
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
}

const ConfirmationDialog = ({
  title,
  description,
  cancel,
  submit,
  handleSubmit,
  openModal,
  setOpenModal,
}: ConfirmationModalProps) => {
  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent className='dark:text-white" dark:bg-slate-700'>
        <DialogHeader>
          <DialogTitle className='dark:text-white" dark:bg-slate-700 dark:text-primary'>
            {title}
          </DialogTitle>
          <DialogDescription className='dark:text-white" dark:bg-slate-700 dark:text-white'>
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-between gap-1 sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            className="flex items-center gap-2 sm:min-w-[100px]"
            onClick={() => {
              setOpenModal(false);
            }}
          >
            <CornerDownLeft size={18} />
            {cancel ?? "Cancel"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="flex items-center gap-2 bg-primary  hover:bg-primary dark:bg-primary dark:text-white dark:hover:bg-primary sm:min-w-[100px]"
            onClick={handleSubmit}
          >
            <Check size={18} />
            {submit ?? "Yes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
