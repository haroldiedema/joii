require('isc')({
    input   : './src/joii.js',  // Input file
    output  : './dist/joii.js', // Output file
    verbose : true,     // Display verbose output?
    minify  : true      // Minify source? (only works if 'output' is also specified
});
