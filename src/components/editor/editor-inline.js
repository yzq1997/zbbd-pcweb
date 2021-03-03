import tinymce from 'tinymce/tinymce'
function initeditor(keyname){
var setting = {
    selector:keyname,
    menubar: false,
    inline: true,
    plugins: [
      'lists',
    ],
    toolbar: 'undo redo | bold italic underline',
    valid_elements: 'strong,em,span[style],a[href]',
    valid_styles: {
      '*': 'font-size,font-family,color,text-decoration,text-align'
    },
    powerpaste_word_import: 'clean',
    powerpaste_html_import: 'clean',
  };
  
  tinymce.init(setting);
}
export { //很关键
    initeditor
}