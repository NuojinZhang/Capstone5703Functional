'use client';

import React, { useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Hits, connectSearchBox } from 'react-instantsearch-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "./ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { Toaster } from "./ui/toaster";

const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!;
const algoliaApiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!;

const searchClient = algoliasearch(algoliaAppId, algoliaApiKey);

const FormSchema = z.object({
    searchValue: z.string().min(2, {
        message: "Search content must be at least 2 characters.",
    }),
});

interface FileHit {
    filename: string;
    filepath: string;
    createdAt: string;
}

const Hit = ({ hit }: { hit: FileHit }) => (
    <div className="card" style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #ccc' }}>
        <div>
            <h2>{hit.filename}</h2>
            <p>File Download Url: <a href={hit.filepath} download={hit.filename}>{hit.filename}</a></p>
            <p>Uploaded at: {hit.createdAt}</p>
        </div>
    </div>
);

const CustomSearchBox = ({ currentRefinement, refine }: any) => (
    <Input
        type="search"
        value={currentRefinement}
        onChange={e => refine(e.currentTarget.value)}
        placeholder="Find Anything...."
        style={{ display: 'none' }} 
    />
);

const ConnectedSearchBox = connectSearchBox(CustomSearchBox);

export function BasicSearch() {
    const { toast } = useToast();
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            searchValue: "",
        },
    });

    const [query, setQuery] = useState("");

    function onSubmit(data: { searchValue: string }) {
        console.log("Search Started");
        toast({
            title: "You are searching the following values:",
            description: (
                <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 text-white">
                    Searching for: {data.searchValue}
                </div>
            ),
        });

        setQuery(data.searchValue);

        console.log("Successfully Search");
    }

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                textAlign: 'center',
            }}
        >
            <Toaster />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                    <FormField
                        control={form.control}
                        name="searchValue"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Search</FormLabel>
                                <FormControl>
                                    <Input placeholder="Find Anything...." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button variant="default" style={{ marginTop: '5px' }}>Search</Button>
                </form>
            </Form>

            {query && (
                <InstantSearch searchClient={searchClient} indexName="5703_FUNCTIONAL">
                    <ConnectedSearchBox defaultRefinement={query} />
                    <Hits hitComponent={Hit} />
                </InstantSearch>
            )}
        </div>
    );
}

export default BasicSearch;
