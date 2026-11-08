/* Konfigurasi: daftar halaman layout, token spesial, dan contoh layout.
   Jika nama halaman di aplikasi Multiling O ternyata berbeda, ubah "id" di sini. */
const PAGES=[
 {id:'main',label:'Utama'},
 {id:'mainShifted',label:'Shift',base:'main',upper:true},
 {id:'altGr',label:'AltGr',base:'main'},
 {id:'altGrShifted',label:'AltGr+Shift',base:'altGr',upper:true},
 {id:'sym',label:'Simbol'},
 {id:'symShifted',label:'Simbol+Shift',base:'sym',upper:true}
];
const KNOWN=['SHIFT','DEL','FDEL','WDEL','ENTER','SPACE','TOOL','SYM','ALTGR','ALTGR:,','SYM:.','123','LEFT','RIGHT','UP','DOWN','W.LEFT','W.RIGHT','HOME','END','PGUP','PGDN','COPY','CUT','PASTE','ALL','UNDO','TRANSLATE','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12',''];
const PRESETS={
 qwerty:{title:'QWERTY saya',onScreen:{main:['1234567890','qwertyuiop','asdfghjkl','[SHIFT]zxcvbnm[DEL]','[TOOL][ALTGR:,][SPACE][SYM:.][ENTER]'],sym:['€$%^&*()_=','@#-+[LEFT][RIGHT]:;','\'"!?[COPY][PASTE]/\\','[TOOL][ALTGR:,][SPACE][SYM:.][ENTER]']}},
 swipe:{title:'Swipe 3x3',onScreen:{main:['[1+4:abc ][1+4:def ][1+4:ghi ]','[1+4:jkl ][1+4:mno ][1+4:pqrs]','[SYM][1+4:tuv ][1+4:wxyz]','[TOOL][SPACE][DEL][ENTER]'],sym:['123','456','789','[TOOL][SPACE][DEL][ENTER]']}},
 blank:{title:'Layout baru',onScreen:{main:['abc','def']}}
};
