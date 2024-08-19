const express = require( "express" );
const fs = require( "fs" );
const app = express();
const PORT = 3000;
let data = require( "./mock.json" );

app.use( express.urlencoded( { extended: false } ) );
app.use(express.json());

app
    .route( "/api/users" )
    .get( ( req, res ) =>
    {
        res.send( data );
    } )


app
    .route( "/api/user/:id" )
    .get( ( req, res ) =>
    {
        const id = Number( req.params.id );
        const user = data.find( ( user ) => user.id === id );
        res.send( user );

    } )


app
    .route( "/users" )
    .get( ( req, res ) =>
    {
        const html = `
        <ul>
            ${ data.map( user => `<li>${ user.first_name }</li>` ).join( '' ).slice( 0, -1 ) };
        </ul>
        `
        res.send( html );
    } )
    .post( ( req, res ) =>
    {
        const body = req.body;
        if ( !body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title )
            return res.status( 400 ).end( "All fields are required" );
        data.push( { id: data.length + 1, ...body } );
        fs.writeFile( "./mock.json", JSON.stringify( data ), ( err, user ) =>
        {
            res.send( `Success: User with ID ${ data.length } has been added.` );
        } );
    } )
    .delete( ( req, res ) =>
    {
        if ( !data[ req.query.id-1 ] )
            return res.status( 400 ).end( "User not found" ); 
        data = data.filter( user => user.id !== Number(req.query.id) );
        fs.writeFile( "./mock.json", JSON.stringify( data ), ( err, user ) =>
        {
            res.send( `Success: User with ID ${ req.query.id } has been Deleted.` );
        } );
    } )
    .patch( ( req, res ) =>
    {
        const body = req.body;
        if ( !data[ Number( body.id )-1 ] )
            return res.status( 400 ).send( "User not found" );
        data[ Number( body.id )-1 ] = body;
        data[ Number( body.id )-1 ].id = Number(body.id);
        fs.writeFile( "./mock.json", JSON.stringify( data ), ( err, user ) =>
            {
                res.send( `Success: User with ID ${ body.id } has been Edited.` );
        } );
    })

app.listen( PORT, () => console.log( 'Server Started!!' ) );