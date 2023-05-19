import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function stockQuantityValidator(selectedProductStock: number | undefined, isIncome: boolean | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (isIncome == null) {
            return null;
        }
        if (!selectedProductStock) {
            return null;
        }
        const quantity = isIncome ? control.value : control.value * -1;
        const totalStock = selectedProductStock + quantity;
        if (totalStock < 0) {
            return { insufficientStock: true };
        }

        return null;
    };
}