export function Footer() {
  return (
    <footer className="flex flex-col md:flex-row justify-between items-center w-full px-margin py-10 gap-gutter bg-electric-blue text-on-primary border-t-2 border-on-primary">
      <div className="font-display-xl text-headline-lg">DGT</div>
      <div className="flex flex-col md:flex-row gap-8 items-center font-body-sm uppercase tracking-widest">
        <a className="opacity-70 hover:opacity-100 transition-opacity" href="/systems">SYSTEMS</a>
        <a className="opacity-70 hover:opacity-100 transition-opacity" href="#">TERMS</a>
        <a className="opacity-70 hover:opacity-100 transition-opacity" href="#">SHIPPING</a>
        <a className="opacity-70 hover:opacity-100 transition-opacity" href="https://wa.me/6281237729115" target="_blank" rel="noopener noreferrer">CONTACT</a>
        <a className="opacity-70 hover:opacity-100 transition-opacity" href="https://www.instagram.com/dgt_lz/" target="_blank" rel="noopener noreferrer">DGT INSTAGRAM</a>
        <a className="opacity-70 hover:opacity-100 transition-opacity" href="https://www.instagram.com/madzilla3dprint.bali/" target="_blank" rel="noopener noreferrer">MADZILLA INSTAGRAM</a>
        <a className="opacity-70 hover:opacity-100 transition-opacity" href="/login">DECK LOGIN</a>
      </div>
      <div className="text-[10px] opacity-60 text-center md:text-right font-body-sm">
        © 2024 DGT ARCHITECTURAL ARTIFACTS. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}
