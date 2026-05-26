import { z } from 'zod'

export const demandOptions = [
  'Căn hộ 1 Phòng ngủ',
  'Căn hộ 2 Phòng ngủ (GP-18.06)',
  'Căn hộ 3 Phòng ngủ',
  'Penthouse Thượng Lưu',
] as const

export const leadFormSchema = z.object({
  fullName: z.string().min(2, { message: 'Họ và tên phải có ít nhất 2 ký tự' }),
  phone: z.string().regex(/^(0[3|5|7|8|9])[0-9]{8}$/, {
    message: 'Số điện thoại không đúng định dạng Việt Nam (ví dụ: 0901234567)',
  }),
  email: z.string().email({ message: 'Email không hợp lệ' }),
  demand: z.enum(demandOptions),
})

export type LeadFormData = z.infer<typeof leadFormSchema>
