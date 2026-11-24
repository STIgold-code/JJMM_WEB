<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <!--metas de fb-->
        <meta property="og:url"           content="https://jjmm.com.pe"/>
        <meta property="og:type"          content="website" />
        <meta property="og:title"         content="{{ config('app.name', 'Laravel') }}" />
        {{-- <meta property="og:description"   content="Estudio Contable JJMM S.A.C. cuenta con un Sistema de Gestión de Calidad Genuino que se mantenga en el tiempo con el alto índice de responsabilidad, calidad, profesionalismo, promoviendo una mejora continua en la ejecución y provisión de nuestros servicios." /> --}}
        <meta property="og:image"         content="https://static.pexels.com/photos/196659/pexels-photo-196659.jpeg"/>
        <meta property="og:site_name"     content="Estudio Contable JJMM" />
            <!--metas-->
        <meta name="author" content="stigold.com"> 
        <meta name="owner" content="STI Gold">
        <meta name="keywords" content="contabilidad en linea, servicio de calidad, estudio contable, constitucion de empresas, asesoria contable,facturacion electronica   "> 
        <meta name="description" content="Estudio Contable JJMM S.A.C.cuenta con un Sistema de Gestión de Calidad Genuino que se mantenga en el tiempo con el alto índice de responsabilidad, calidad, profesionalismo, promoviendo una mejora continua en la ejecución y provisión de nuestros servicios.">
        

        <title>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap">

        <!-- Styles -->
        <link rel="stylesheet" href="{{ mix('css/app.css') }}">

        @livewireStyles

        <!-- Scripts -->
        <script src="{{ mix('js/app.js') }}" defer></script>
    </head>

    <body class="font-sans antialiased">
        <x-jet-banner />

        <div class="min-h-screen bg-gray-100">
            @livewire('navigation')


            <!-- Page Content -->
            <main>
                {{ $slot }}
            </main>
        </div>

        @stack('modals')

        @livewireScripts
    </body>
</html>
