/**
 * Official Thai EMVCo PromptPay QR Payload Generator (with CRC-16/CCITT-FALSE).
 * Supports 10-digit mobile numbers (08x/09x/06x) and 13-digit National/Tax IDs.
 */

function f(id: string, value: string): string {
  const len = String(value.length).padStart(2, '0');
  return `${id}${len}${value}`;
}

function crc16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function buildPromptPayPayload(promptPayId: string, amount?: number): string {
  const digits = promptPayId.replace(/\D/g, '');
  let target = '';
  if (digits.length === 10 && digits.startsWith('0')) {
    // Mobile number -> 0066 + 9 digits
    target = f('01', `0066${digits.slice(1)}`);
  } else if (digits.length === 13) {
    // National ID / Tax ID
    target = f('02', digits);
  } else {
    target = f('01', digits);
  }

  const merchantInfo = f('29', f('00', 'A000000677010111') + target);
  const parts = [
    f('00', '01'),
    f('01', amount && amount > 0 ? '12' : '11'),
    merchantInfo,
    f('53', '764'), // THB
    ...(amount && amount > 0 ? [f('54', amount.toFixed(2))] : []),
    f('58', 'TH'),
  ];

  const raw = parts.join('') + '6304';
  return raw + crc16(raw);
}
