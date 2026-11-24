@php
    setlocale(LC_TIME, 'Spanish');    
@endphp
<style>
    #body h1{
        font-size: 3rem;
    }
    #body li{
        padding-left: 2rem; 
    }
</style>

<script async defer crossorigin="anonymous" 
    src="https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v10.0&appId=133843493900814&autoLogAppEvents=1" nonce="T2H0hqMK">
</script>
<x-app-layout>
    <div class="container py-8">
        <h1 class="text-4xl font-bold text-gray-600 pb-3">{{$post->name}}</h1>
        <div class="text-lg text-gray-500 mb-2">
            {!!$post->extract!!}
        </div>
        {{ $post->created_at->formatLocalized('%A, %d %B %Y') }}

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {{-- contenido principal --}}
            <div class="lg:col-span-2">
                <figure>
                    @if ($post->image)
                        <img class="w-full h-80 object-cover object-center" src="{{Storage::url($post->image->url)}}" alt="">
                    @else
                        <img class="w-full h-80 object-cover object-center" src="https://cdn.pixabay.com/photo/2021/02/08/20/24/lake-5996427_960_720.jpg" alt="">
                    @endif
                </figure>

                <div class="fb-like mt-3" data-href="{{Request::url()}}" data-width="" data-layout="button_count" data-action="like" data-size="large" data-share="true"></div>

                <div class="text-base text-gray-600 mt-4">
                    <div id="body">
                        {!!$post->body!!}
                    </div>
                </div>
            </div>
            {{-- contenido relacionado --}}
            <aside>
                <h1 class="text-2xl font-bold text-gray-600 mb-4">Más en {{$post->category->name}}</h1>
                <ul>
                    @foreach ($similares as $similar)
                        <li class="mb-4">
                            <a class="flex" href="{{route('posts.show', $similar)}}">
                                @if ($similar->image)
                                    <img class="w-36 h-20 object-cover object-center" src="{{Storage::url($similar->image->url)}}" alt="">
                                @else
                                    <img class="w-36 h-20 object-cover object-center" src="https://cdn.pixabay.com/photo/2021/02/08/20/24/lake-5996427_960_720.jpg" alt="">
                                @endif
                                <span class="ml-2 text-gray-600">{{$similar->name}}</span>
                            </a>
                        </li>
                    @endforeach
                </ul>
                <div class="fb-page" data-href="https://www.facebook.com/EstudioContableJJMM/" data-tabs="timeline" data-width="" data-height="" data-small-header="false" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true">
                    <blockquote cite="https://www.facebook.com/EstudioContableJJMM/" class="fb-xfbml-parse-ignore">
                        <a href="https://www.facebook.com/EstudioContableJJMM/">Estudio Contable JJMM</a>
                    </blockquote>
                </div>
            </aside>
        </div>
        <hr class="my-5">

            @livewire('commentaries', ['post_id' => $post->id])

    </div>
</x-app-layout>