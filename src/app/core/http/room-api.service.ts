import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { firstValueFrom, Observable } from "rxjs";
import { environment } from "../../../environments/environment";

interface CreateRoomResponse {
  roomId: string;
}

@Service()
export class RoomApiService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/rooms`;

    async createRoom(): Promise<string> {
        const response = await firstValueFrom(
            this.http.post<CreateRoomResponse>(this.baseUrl, {})
        );
        return response.roomId;
    }

    previewCsvHeaders(roomId: string, file: File) {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{
            headers: string[];
            delimiter: string;
            suggestedTitleColumn: string | null;
            suggestedPriorityColumn: string | null;
            suggestedLinkColumn: string | null;
        }>(`${this.baseUrl}/${roomId}/previewCsvHeaders`, formData);
    }

    importTasks(
        roomId: string, 
        file: File,
        mapping: { titleColumn: string; priorityColumn: string | null; linkColumn: string | null }
    ): Observable<void> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('titleColumn', mapping.titleColumn);
        if (mapping.priorityColumn) formData.append('priorityColumn', mapping.priorityColumn);
        if (mapping.linkColumn) formData.append('linkColumn', mapping.linkColumn);

        return this.http.post<void>(`${this.baseUrl}/${roomId}/importTasks`, formData)
    }

    exportTasksUrl(roomId: string): string {
        return `${this.baseUrl}/${roomId}/exportTasks`;
    }

    async roomExists(roomId: string): Promise<boolean> {
        try {
            await firstValueFrom(this.http.get(`${this.baseUrl}/${roomId}/exists`));
            return true;
        } catch {
            return false;
        }
    }

    async uploadCardBack(roomId: string, userId: string, image: Blob): Promise<void> {
        const formData = new FormData();
        formData.append('file', image, 'card-back.jpg');
        await firstValueFrom(
            this.http.post(`${this.baseUrl}/${roomId}/participants/${userId}/cardBack`, formData),
        );
    }

    async deleteCardBack(roomId: string, userId: string): Promise<void> {
        await firstValueFrom(
            this.http.post(`${this.baseUrl}/${roomId}/participants/${userId}/cardBack/delete`, {}),
        );
    }

    cardBackUrl(roomId: string, userId: string, version: string): string {
        return `${this.baseUrl}/${roomId}/participants/${userId}/cardBack?v=${version}`;
    }
}